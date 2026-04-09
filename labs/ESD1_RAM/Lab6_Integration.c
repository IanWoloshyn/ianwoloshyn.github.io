//-------------------------------------------------------------------------
//-- Ian Woloshyn
//-- CPET 561 Embedded System Design 1
//-- Lab 6 Part 2 - Byte-Enable RAM C Integration
//-- March 24th, 2025
//-------------------------------------------------------------------------

#include "io.h"
#include <stdio.h>
#include "system.h"
#include "alt_types.h"
#include "sys/alt_irq.h"

typedef unsigned char   uint8;
typedef unsigned short  uint16;
typedef unsigned long   uint32;

volatile uint32 *leds    = (uint32 *) LEDS_BASE;
volatile uint32 *buttons = (uint32 *) KEY1_BASE;
volatile uint8   stop_test = 0;

// ISR: KEY1 press stops the test
void key_ISR(void* context) {
    stop_test = 1;
    *(buttons + 3) = 0xFF;  // Clear interrupts
}

// 8-bit byte-accessible RAM test
void byte_accessible_ram_test(uint32 start_addr, uint32 num_bytes, uint8 test_data) {
    uint8* addr = (uint8*) start_addr;
    for (uint32 i = 0; i < num_bytes && !stop_test; i++) {
        addr[i] = test_data;
    }
    for (uint32 i = 0; i < num_bytes && !stop_test; i++) {
        if (addr[i] != test_data) {
            *leds = 0xFF;  // Error: light all LEDs
            return;
        }
    }
}

// 16-bit half-word accessible RAM test
void word_accessible_ram_test(uint32 start_addr, uint32 num_words, uint16 test_data) {
    uint16* addr = (uint16*) start_addr;
    for (uint32 i = 0; i < num_words && !stop_test; i++) {
        addr[i] = test_data;
    }
    for (uint32 i = 0; i < num_words && !stop_test; i++) {
        if (addr[i] != test_data) {
            *leds = 0xFF;
            return;
        }
    }
}

// 32-bit word accessible RAM test
void dword_accessible_ram_test(uint32 start_addr, uint32 num_dwords, uint32 test_data) {
    uint32* addr = (uint32*) start_addr;
    for (uint32 i = 0; i < num_dwords && !stop_test; i++) {
        addr[i] = test_data;
    }
    for (uint32 i = 0; i < num_dwords && !stop_test; i++) {
        if (addr[i] != test_data) {
            *leds = 0xFF;
            return;
        }
    }
}

int main() {
    uint32 start_addr   = RAMINFR_BE_0_BASE;
    uint32 num_dwords   = 4096;
    uint32 num_words    = 8192;
    uint32 num_bytes    = 16384;
    uint32 test_data_32 = 0x12345678;
    uint16 test_data_16 = 0xABCD;
    uint8  test_data_8  = 0x7F;

    alt_ic_isr_register(KEY_IRQ_INTERRUPT_CONTROLLER_ID, KEY_IRQ, key_ISR, NULL, NULL);

    printf("Starting RAM Tests. Press KEY1 to stop.\n");

    printf("Running 8-bit test...\n");
    byte_accessible_ram_test(start_addr, num_bytes, test_data_8);

    if (!stop_test) {
        printf("Running 16-bit test...\n");
        word_accessible_ram_test(start_addr, num_words, test_data_16);
    }

    if (!stop_test) {
        printf("Running 32-bit test...\n");
        dword_accessible_ram_test(start_addr, num_dwords, test_data_32);
    }

    printf("RAM Test Complete.\n");
    *leds = stop_test ? 0xFF : 0x00;  // All LEDs on = stopped early

    while (1);
    return 0;
}