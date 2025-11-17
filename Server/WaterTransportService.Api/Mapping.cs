using AutoMapper;
using WaterTransportService.Model.Entities;
using WaterTransportService.Api.DTO;

namespace WaterTransportService.Api;

public class Mapping : Profile
{
    public Mapping()
    {
        CreateMap<User, UserDto>().ReverseMap();
        CreateMap<User, CreateUserDto>().ReverseMap();
        CreateMap<User, UpdateUserDto>().ReverseMap();
        CreateMap<UserProfile, UserProfileDto>().ReverseMap();
        CreateMap<Port, PortDto>().ReverseMap();
        CreateMap<Port, CreatePortDto>().ReverseMap();
        CreateMap<Port, UpdatePortDto>().ReverseMap();
        CreateMap<Ship, ShipDto>().ReverseMap();
        CreateMap<Ship, CreateShipDto>().ReverseMap();
        CreateMap<Ship, UpdateShipDto>().ReverseMap();
        CreateMap<ShipType, ShipTypeDto>().ReverseMap();
        CreateMap<ShipType, CreateShipTypeDto>().ReverseMap();
        CreateMap<ShipType, UpdateShipTypeDto>().ReverseMap();
        CreateMap<ShipImage, ShipImageDto>().ReverseMap();  
        CreateMap<ShipImage, CreateShipImageDto>().ReverseMap();    
        CreateMap<ShipImage, UpdateShipImageDto>().ReverseMap();
    }
}