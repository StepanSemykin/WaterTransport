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
            .ConstructUsing(u => new AuthUserDto(u.Phone, u.Role));
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
        
        // Image mappings
        CreateMap<ShipImage, ShipImageDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.ShipId, opt => opt.MapFrom(src => src.ShipId))
            .ForMember(dest => dest.ImagePath, opt => opt.MapFrom(src => src.ImagePath))
            .ForMember(dest => dest.IsPrimary, opt => opt.MapFrom(src => src.IsPrimary))
            .ForMember(dest => dest.UploadedAt, opt => opt.MapFrom(src => src.UploadedAt));
        
        CreateMap<PortImage, PortImageDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.PortId, opt => opt.MapFrom(src => src.PortId))
            .ForMember(dest => dest.ImagePath, opt => opt.MapFrom(src => src.ImagePath))
            .ForMember(dest => dest.IsPrimary, opt => opt.MapFrom(src => src.IsPrimary))
            .ForMember(dest => dest.UploadedAt, opt => opt.MapFrom(src => src.UploadedAt));
        
        CreateMap<UserImage, UserImageDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserProfileId))
            .ForMember(dest => dest.ImagePath, opt => opt.MapFrom(src => src.ImagePath))
            .ForMember(dest => dest.IsPrimary, opt => opt.MapFrom(src => src.IsPrimary))
            .ForMember(dest => dest.UploadedAt, opt => opt.MapFrom(src => src.UploadedAt));
    }
}