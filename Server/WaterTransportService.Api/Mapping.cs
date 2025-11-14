using AutoMapper;
using WaterTransportService.Model.Entities;
using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api;

public class Mapping : Profile
{
    public Mapping()
    {
        CreateMap<User, UserDto>().ReverseMap();
        CreateMap<UserProfile, UserProfileDto>().ReverseMap();
    }
}