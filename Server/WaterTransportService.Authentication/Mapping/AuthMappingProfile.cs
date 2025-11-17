using AutoMapper;
using WaterTransportService.Authentication.DTO;
using WaterTransportService.Model.Entities;

namespace WaterTransportService.Authentication.Mapping;

public class AuthMappingProfile : Profile
{
    public AuthMappingProfile()
    {
        CreateMap<User, UserDto>()
            .ConstructUsing(u => new UserDto(u.Phone, u.Role));
    }
}
