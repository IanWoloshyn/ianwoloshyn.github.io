-------------------------------------------------------------------------
-- Ian Woloshyn
-- CPET 561 Embedded System Design 1
-- Lab 6 raminfr_be.vhd
-- March 26th 2025
-------------------------------------------------------------------------

LIBRARY ieee;
USE ieee.std_logic_1164.ALL;
USE ieee.std_logic_unsigned.ALL;

ENTITY raminfr IS
PORT(
    clk               : IN std_logic;
    reset_n           : IN std_logic;
    writebyteenable_n : IN std_logic_vector(3 DOWNTO 0);
    address           : IN std_logic_vector(11 DOWNTO 0);
    writedata         : IN std_logic_vector(31 DOWNTO 0);
    
    readdata          : OUT std_logic_vector(31 DOWNTO 0)
);
END ENTITY raminfr;

ARCHITECTURE rtl OF raminfr IS
    TYPE ram_type IS ARRAY (4095 DOWNTO 0) OF std_logic_vector (7 DOWNTO 0);
    SIGNAL RAM0 : ram_type;  -- Byte 0
    SIGNAL RAM1 : ram_type;  -- Byte 1
    SIGNAL RAM2 : ram_type;  -- Byte 2
    SIGNAL RAM3 : ram_type;  -- Byte 3
    SIGNAL read_addr : std_logic_vector(11 DOWNTO 0);

BEGIN
    RamBlock : PROCESS(clk)
    BEGIN
        IF (clk'event AND clk = '1') THEN
            IF (reset_n = '0') THEN
                read_addr <= (OTHERS => '0');
                FOR i IN 0 TO 4095 LOOP
                    RAM0(i) <= (OTHERS => '0');
                    RAM1(i) <= (OTHERS => '0');
                    RAM2(i) <= (OTHERS => '0');
                    RAM3(i) <= (OTHERS => '0');
                END LOOP;
            ELSE
                -- Independent byte-enable control
                IF (writebyteenable_n(0) = '0') THEN
                    RAM0(conv_integer(address)) <= writedata(7 DOWNTO 0);
                END IF;
                IF (writebyteenable_n(1) = '0') THEN
                    RAM1(conv_integer(address)) <= writedata(15 DOWNTO 8);
                END IF;
                IF (writebyteenable_n(2) = '0') THEN
                    RAM2(conv_integer(address)) <= writedata(23 DOWNTO 16);
                END IF;
                IF (writebyteenable_n(3) = '0') THEN
                    RAM3(conv_integer(address)) <= writedata(31 DOWNTO 24);
                END IF;
            END IF;
            read_addr <= address;
        END IF;
    END PROCESS RamBlock;

    -- Concurrent read assignment
    readdata(7 DOWNTO 0)   <= RAM0(conv_integer(read_addr));
    readdata(15 DOWNTO 8)  <= RAM1(conv_integer(read_addr));
    readdata(23 DOWNTO 16) <= RAM2(conv_integer(read_addr));
    readdata(31 DOWNTO 24) <= RAM3(conv_integer(read_addr));

END ARCHITECTURE rtl;