using Algorand;
using Algorand.V2;
using Algorand.Client;
using Algorand.V2.Model;
using Account = Algorand.Account;

// using Nethereum.Util;
using System.ComponentModel.DataAnnotations;

namespace Backend.Validations;

public class AlgorandAddressAttribute : ValidationAttribute
{
    public override bool IsValid(object? value) =>
        value is string address && Address.IsValid(address);
}