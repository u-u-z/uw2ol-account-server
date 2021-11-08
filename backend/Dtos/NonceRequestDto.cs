using Backend.Validations;

namespace Backend.Dtos;

public class NonceRequestDto
{
    [EthereumAddress || AlgorandAddress]
    public string Address { get; set; } = default!;
}
