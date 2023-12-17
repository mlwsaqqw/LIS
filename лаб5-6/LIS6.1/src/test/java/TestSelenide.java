import org.junit.Test;

import static com.codeborne.selenide.Selenide.$x;
import static com.codeborne.selenide.Selenide.open;

public class TestSelenide {
    @Test
    public void testGoogle(){
        open("https://www.google.ru/");
        $x("//input[@name='q']").setValue("selenium").pressEnter();
    }
}
