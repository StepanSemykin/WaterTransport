namespace WaterTransportService.Infrastructure.PasswordValidator;

public class PasswordValidator: IPasswordValidator
{
    public bool IsPasswordValid(string password)
    {
        const int MIN_PASSWORD_LENGTH = 8;
        const int MIN_LOWERCASE = 1;
        const int MIN_UPPERCASE = 1;
        const int MIN_NUMBERS = 1;
        const int MIN_SYMBOLS = 0;

        if (string.IsNullOrEmpty(password) || password.Length < MIN_PASSWORD_LENGTH)
            return false;

        int lowercase = password.Count(char.IsLower);
        int uppercase = password.Count(char.IsUpper);
        int numbers = password.Count(char.IsDigit);
        int symbols = password.Count(c => !char.IsLetterOrDigit(c));

        return lowercase >= MIN_LOWERCASE
            && uppercase >= MIN_UPPERCASE
            && numbers >= MIN_NUMBERS
            && symbols >= MIN_SYMBOLS;
    }
}
