//-------------------------------------------------------------------------
//-- Ian Woloshyn
//-- CPET 561 Embedded System Design 1
//-- Lab 5 C
//-- March 18th, 2025
//-------------------------------------------------------------------------

#include "io.h"
#include <stdio.h>
#include "system.h"
#include "alt_types.h"
#include "sys/alt_irq.h"

typedef unsigned char   uint8;
typedef unsigned short  uint16;
typedef unsigned long   uint32;

volatile uint32 min_angle = 46;
volatile uint32 max_angle = 134;
volatile uint8  update_display = 0;

uint32 *hex5    = (uint32 *) HEX5_BASE;
uint32 *hex4    = (uint32 *) HEX4_BASE;
uint32 *hex2    = (uint32 *) HEX2_BASE;
uint32 *hex1    = (uint32 *) HEX1_BASE;
uint32 *hex0    = (uint32 *) HEX0_BASE;
volatile uint32 *buttons = (uint32 *) PUSHBUTTONS_BASE;
volatile uint32 *switches= (uint32 *) SWITCHES_BASE;
uint32 *servo   = (uint32 *) SERVO_CONTROLLER_0_BASE;

// 7-Segment Display map (0-9)
const uint8 SEGMENT_MAP[10] = {
    0x40, 0x79, 0x24, 0x30, 0x19,
    0x12, 0x02, 0x78, 0x00, 0x10
};

// Convert angle (degrees) to PWM duty cycle count
int angleToDuty(int duty) {
    int count = duty * (50000/90) + 50000/2;
    return count;
}

// Display a 3-digit value on 7-seg displays
void display_angle(uint32 value, uint32 *hundreds, uint32 *tens, uint32 *ones) {
    uint8 h = (value >= 100);
    uint8 t = ((value / 10) % 10);
    uint8 o = value % 10;
    *ones = SEGMENT_MAP[o];
    *tens = SEGMENT_MAP[t];
    if (hundreds) *hundreds = SEGMENT_MAP[h];
}

// ISR: Pushbutton updates min/max angle from switch position
void pushbutton_ISR(void* context) {
    uint32 button_edge = *(buttons + 3);

    if (button_edge & 0x8) {    // KEY3: set min angle
        min_angle = *switches;
    }
    if (button_edge & 0x4) {    // KEY2: set max angle
        max_angle = *switches;
    }

    update_display = 1;
    *(buttons + 3) = 0xFF;  // Clear edge-capture register
}

// ISR: Servo reached min/max — write new angles to IP core
void servo_ISR(void* context) {
    *(servo + 0) = angleToDuty(min_angle);
    *(servo + 1) = angleToDuty(max_angle);
}

int main(void) {
    // Register ISRs
    alt_ic_isr_register(PUSHBUTTONS_IRQ_INTERRUPT_CONTROLLER_ID,
                        PUSHBUTTONS_IRQ, pushbutton_ISR, 0, 0);
    alt_ic_isr_register(SERVO_CONTROLLER_0_IRQ_INTERRUPT_CONTROLLER_ID,
                        SERVO_CONTROLLER_0_IRQ, servo_ISR, 0, 0);

    // Initialize servo with default angles
    *(servo + 0) = angleToDuty(min_angle);
    *(servo + 1) = angleToDuty(max_angle);

    // Initialize displays
    display_angle(min_angle, NULL, hex5, hex4);
    display_angle(max_angle, hex2, hex1, hex0);

    // Enable KEY3 and KEY2 interrupts, clear pending
    *(buttons + 2) = 0x0;
    *(buttons + 2) |= 0x0C;
    *(buttons + 3)  = 0xFF;

    while (1) {
        if (update_display) {
            display_angle(min_angle, NULL, hex5, hex4);
            display_angle(max_angle, hex2, hex1, hex0);
            update_display = 0;
        }
    }
    return 0;
}