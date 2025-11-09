import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class ExampleTest {

    @Test
    void testCountVowels() {
        assertEquals(11, "Hello World".length());

    }

    @ParameterizedTest
    @ValueSource(strings = {"radar", "level"})
    void testPalindromes(String input) {
        assertEquals(5, input.length());
    }

    @ParameterizedTest
    @CsvSource({
            "hello, 5",
            "test, 4",
            "xyz, 3"
    })
    void testCountVowelsWithCsv(String input, int expected) {
        assertEquals(expected, input.length());
    }

    @ParameterizedTest
    @MethodSource("provideStringsForReverse")
    void testReverseWithMethodSource(String input, String expected) {
        assertEquals(expected, input);
    }

    private static Stream<Arguments> provideStringsForReverse() {
        return Stream.of(
                Arguments.of("hello", "hello"),
                Arguments.of("test", "test"),
                Arguments.of("xyz", "xyz")
        );
    }
}
