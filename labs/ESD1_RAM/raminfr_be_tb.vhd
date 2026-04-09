-------------------------------------------------------------------------
-- Ian Woloshyn
-- CPET 561 Embedded System Design 1
-- Lab 6 raminfr_be Testbench
-- March 26th 2025
-------------------------------------------------------------------------

LIBRARY ieee;
USE ieee.std_logic_1164.ALL;
USE ieee.std_logic_unsigned.ALL;
USE ieee.numeric_std.ALL;

ENTITY raminfr_be_tb IS
END ENTITY raminfr_be_tb;

ARCHITECTURE Behavioral OF raminfr_be_tb IS

    COMPONENT raminfr IS
    PORT(
        clk               : IN  std_logic;
        reset_n           : IN  std_logic;
        writebyteenable_n : IN  std_logic_vector(3 DOWNTO 0);
        address           : IN  std_logic_vector(11 DOWNTO 0);
        writedata         : IN  std_logic_vector(31 DOWNTO 0);
        readdata          : OUT std_logic_vector(31 DOWNTO 0)
    );
    END COMPONENT;

    -- Signals
    SIGNAL clk               : std_logic := '0';
    SIGNAL reset_n           : std_logic := '0';
    SIGNAL writebyteenable_n : std_logic_vector(3 DOWNTO 0) := "1111";
    SIGNAL address           : std_logic_vector(11 DOWNTO 0) := (OTHERS => '0');
    SIGNAL writedata         : std_logic_vector(31 DOWNTO 0) := (OTHERS => '0');
    SIGNAL readdata          : std_logic_vector(31 DOWNTO 0);

    CONSTANT CLK_PERIOD : time := 20 ns;

BEGIN

    -- UUT Instantiation
    uut: raminfr PORT MAP (
        clk               => clk,
        reset_n           => reset_n,
        writebyteenable_n => writebyteenable_n,
        address           => address,
        writedata         => writedata,
        readdata          => readdata
    );

    -- 50 MHz clock
    clk_proc: PROCESS
    BEGIN
        clk <= '0'; wait for CLK_PERIOD / 2;
        clk <= '1'; wait for CLK_PERIOD / 2;
    END PROCESS;

    -- Stimulus
    stim_proc: PROCESS
    BEGIN
        -- Reset
        reset_n <= '0';
        wait for 40 ns;
        reset_n <= '1';
        wait for 40 ns;

        -- 1) Full Word test: writebyteenable_n = "0000" (all bytes enabled)
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "0000";
            writedata         <= x"DEADBEEF";
            wait for CLK_PERIOD;
        END LOOP;
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "1111";  -- read only
            wait for CLK_PERIOD;
            assert readdata = x"DEADBEEF"
                report "FAIL: Full Word @ addr " & integer'image(i)
                severity ERROR;
        END LOOP;
        report "PASS: Full Word test (4096 addresses)";

        -- 2) Top Half Word: writebyteenable_n = "0011" (bytes 3:2 enabled)
        --    Pre-fill all with 0x00000000, then write top 2 bytes only
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "0000";
            writedata         <= x"00000000";
            wait for CLK_PERIOD;
        END LOOP;
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "0011";
            writedata         <= x"AAAAAAAA";
            wait for CLK_PERIOD;
        END LOOP;
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "1111";
            wait for CLK_PERIOD;
            assert readdata = x"AAAA0000"
                report "FAIL: Top Half Word @ addr " & integer'image(i)
                severity ERROR;
        END LOOP;
        report "PASS: Top Half Word test (4096 addresses)";

        -- 3) Bottom Half Word: writebyteenable_n = "1100" (bytes 1:0 enabled)
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "0000";
            writedata         <= x"00000000";
            wait for CLK_PERIOD;
        END LOOP;
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "1100";
            writedata         <= x"BBBBBBBB";
            wait for CLK_PERIOD;
        END LOOP;
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "1111";
            wait for CLK_PERIOD;
            assert readdata = x"0000BBBB"
                report "FAIL: Bottom Half Word @ addr " & integer'image(i)
                severity ERROR;
        END LOOP;
        report "PASS: Bottom Half Word test (4096 addresses)";

        -- 4) Individual Byte 0 (bits 7:0): writebyteenable_n = "1110"
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "0000";
            writedata         <= x"00000000";
            wait for CLK_PERIOD;
        END LOOP;
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "1110";
            writedata         <= x"CCCCCCCC";
            wait for CLK_PERIOD;
        END LOOP;
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "1111";
            wait for CLK_PERIOD;
            assert readdata = x"000000CC"
                report "FAIL: Byte 0 @ addr " & integer'image(i)
                severity ERROR;
        END LOOP;
        report "PASS: Byte 0 test (4096 addresses)";

        -- 5) Individual Byte 1 (bits 15:8): writebyteenable_n = "1101"
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "0000";
            writedata         <= x"00000000";
            wait for CLK_PERIOD;
        END LOOP;
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "1101";
            writedata         <= x"DDDDDDDD";
            wait for CLK_PERIOD;
        END LOOP;
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "1111";
            wait for CLK_PERIOD;
            assert readdata = x"0000DD00"
                report "FAIL: Byte 1 @ addr " & integer'image(i)
                severity ERROR;
        END LOOP;
        report "PASS: Byte 1 test (4096 addresses)";

        -- 6) Individual Byte 2 (bits 23:16): writebyteenable_n = "1011"
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "0000";
            writedata         <= x"00000000";
            wait for CLK_PERIOD;
        END LOOP;
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "1011";
            writedata         <= x"EEEEEEEE";
            wait for CLK_PERIOD;
        END LOOP;
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "1111";
            wait for CLK_PERIOD;
            assert readdata = x"00EE0000"
                report "FAIL: Byte 2 @ addr " & integer'image(i)
                severity ERROR;
        END LOOP;
        report "PASS: Byte 2 test (4096 addresses)";

        -- 7) Individual Byte 3 (bits 31:24): writebyteenable_n = "0111"
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "0000";
            writedata         <= x"00000000";
            wait for CLK_PERIOD;
        END LOOP;
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "0111";
            writedata         <= x"FFFFFFFF";
            wait for CLK_PERIOD;
        END LOOP;
        FOR i IN 0 TO 4095 LOOP
            address           <= std_logic_vector(to_unsigned(i, 12));
            writebyteenable_n <= "1111";
            wait for CLK_PERIOD;
            assert readdata = x"FF000000"
                report "FAIL: Byte 3 @ addr " & integer'image(i)
                severity ERROR;
        END LOOP;
        report "PASS: Byte 3 test (4096 addresses)";

        report "ALL TESTS PASSED - 28,672 read/write operations validated";
        wait;
    END PROCESS;

END ARCHITECTURE Behavioral;