using AutoMapper;
using WaterTransportService.Api.DTO;
using WaterTransportService.Authentication.DTO;
using WaterTransportService.Model.Entities;
using AuthUserDto = WaterTransportService.Authentication.DTO.UserDto;

namespace WaterTransportService.Api;

public class Mapping : Profile
{
    public Mapping()
    {
        CreateMap<User, AuthUserDto>()
            .ConstructUsing(u => new AuthUserDto(u.Id, u.Phone, u.Role));
        CreateMap<User, CreateUserDto>().ReverseMap();
        CreateMap<User, UpdateUserDto>().ReverseMap();
        CreateMap<UserProfile, UserProfileDto>().ReverseMap();
        
        // Port mappings with ID
        CreateMap<Port, PortDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id));
        CreateMap<Port, CreatePortDto>().ReverseMap();
        CreateMap<Port, UpdatePortDto>().ReverseMap();
        
        // Ship mappings with ID
        CreateMap<Ship, ShipDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.PortId, opt => opt.MapFrom(src => src.PortId))
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId));
        
        CreateMap<ShipType, ShipTypeDto>().ReverseMap();
        CreateMap<ShipType, CreateShipTypeDto>().ReverseMap();
        CreateMap<ShipType, UpdateShipTypeDto>().ReverseMap();
        
        // Image mappings
        CreateMap<ShipImage, ShipImageDto>()
            .ConstructUsing(src => new ShipImageDto(
                src.Id,
                src.ShipId,
                src.ImagePath,
                src.IsPrimary,
                src.UploadedAt
            ));
        
        CreateMap<PortImage, PortImageDto>()
            .ConstructUsing(src => new PortImageDto(
                src.Id,
                src.PortId,
                src.ImagePath,
                src.IsPrimary,
                src.UploadedAt
            ));
        
        CreateMap<UserImage, UserImageDto>()
            .ConstructUsing(src => new UserImageDto(
                src.Id,
                src.UserProfileId,
                src.ImagePath,
                src.IsPrimary,
                src.UploadedAt
            ));
    }
}