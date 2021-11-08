using Backend.Validations;

namespace Backend.Dtos;

public class AlgoNonceRequestDto
{
    [AlgorandAddress]
    public string Address { get; set; } = default!;
}