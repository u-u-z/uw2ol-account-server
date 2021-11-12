namespace Backend.Dtos;

public class AlgoAuthRequestDto
{
    public string Address { get; set; } = default!; // publicKey
    public string Signature { get; set; } = default!;
    public string Session { get; set; } = default!;
    public string Message { get; set; } = default!;
}
