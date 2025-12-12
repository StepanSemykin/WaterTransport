using AutoMapper;
using WaterTransportService.Api.DTO;
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

        CreateMap<UserProfile, UserProfileDto>()
            .ConstructUsing(src => new UserProfileDto(
                src.UserId,
                src.Nickname,
                src.FirstName,
                src.LastName,
                src.Patronymic,
                src.Email,
                src.Birthday,
                src.About,
                src.Location
            ));

        // Port mappings with ID
        CreateMap<Port, PortDto>().ReverseMap();
        CreateMap<Port, CreatePortDto>().ReverseMap();
        CreateMap<Port, UpdatePortDto>().ReverseMap();

        // RentOrder mappings
        CreateMap<RentOrder, RentOrderDto>()
            .ConstructUsing(src => new RentOrderDto(
                src.Id,
                src.UserId,
                src.User != null && src.User.UserProfile != null ? new UserProfileDto(
                    src.User.UserProfile.UserId,
                    src.User.UserProfile.Nickname,
                    src.User.UserProfile.FirstName,
                    src.User.UserProfile.LastName,
                    src.User.UserProfile.Patronymic,
                    src.User.UserProfile.Email,
                    src.User.UserProfile.Birthday,
                    src.User.UserProfile.About,
                    src.User.UserProfile.Location
                ) : null,
                src.ShipTypeId,
                src.ShipType != null ? src.ShipType.Name : null,
                src.DeparturePortId,
                src.DeparturePort != null ? new PortDto(
                    src.DeparturePort.Id,
                    src.DeparturePort.Title,
                    src.DeparturePort.PortTypeId,
                    src.DeparturePort.Latitude,
                    src.DeparturePort.Longitude,
                    src.DeparturePort.Address
                ) : null,
                src.ArrivalPortId,
                src.ArrivalPort != null ? new PortDto(
                    src.ArrivalPort.Id,
                    src.ArrivalPort.Title,
                    src.ArrivalPort.PortTypeId,
                    src.ArrivalPort.Latitude,
                    src.ArrivalPort.Longitude,
                    src.ArrivalPort.Address
                ) : null,
                src.PartnerId,
                src.Partner != null && src.Partner.UserProfile != null ? new UserProfileDto(
                    src.Partner.UserProfile.UserId,
                    src.Partner.UserProfile.Nickname,
                    src.Partner.UserProfile.FirstName,
                    src.Partner.UserProfile.LastName,
                    src.Partner.UserProfile.Patronymic,
                    src.Partner.UserProfile.Email,
                    src.Partner.UserProfile.Birthday,
                    src.Partner.UserProfile.About,
                    src.Partner.UserProfile.Location
                ) : null,
                src.ShipId,
                src.Ship != null ? new ShipDetailsDto(
                    src.Ship.Id,
                    src.Ship.Name,
                    src.Ship.ShipTypeId,
                    src.Ship.ShipType != null ? src.Ship.ShipType.Name : string.Empty,
                    src.Ship.Capacity,
                    src.Ship.RegistrationNumber,
                    src.Ship.YearOfManufacture,
                    src.Ship.MaxSpeed,
                    src.Ship.Width,
                    src.Ship.Length,
                    src.Ship.Description,
                    src.Ship.CostPerHour,
                    src.Ship.PortId,
                    src.Ship.UserId,
                    src.Ship.ShipImages != null ? src.Ship.ShipImages.Where(img => img.IsPrimary).Select(img => img.ImagePath).FirstOrDefault() : null,
                    null // PrimaryImageMimeType will be populated later via WithBase64ImageAsync
                ) : null,
                src.TotalPrice,
                src.NumberOfPassengers,
                src.RentalStartTime,
                src.RentalEndTime,
                src.OrderDate,
                src.Status
            ));



        // Ship mappings with ID

        CreateMap<Ship, ShipDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.PortId, opt => opt.MapFrom(src => src.PortId))
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
            .ForMember(dest => dest.Reviews, opt => opt.MapFrom(src => src.Reviews));

        // Ship with details mapping
        CreateMap<Ship, ShipDetailsDto>()
            .ConstructUsing(src => new ShipDetailsDto(
                src.Id,
                src.Name,
                src.ShipTypeId,
                src.ShipType != null ? src.ShipType.Name : string.Empty,
                src.Capacity,
                src.RegistrationNumber,
                src.YearOfManufacture,
                src.MaxSpeed,
                src.Width,
                src.Length,
                src.Description,
                src.CostPerHour,
                src.PortId,
                src.UserId,
                src.ShipImages != null ? src.ShipImages.Where(img => img.IsPrimary).Select(img => img.ImagePath).FirstOrDefault() : null,
                null // PrimaryImageMimeType will be populated later via WithBase64ImageAsync
            ));

        CreateMap<ShipType, ShipTypeDto>().ReverseMap();
        CreateMap<ShipType, CreateShipTypeDto>().ReverseMap();
        CreateMap<ShipType, UpdateShipTypeDto>().ReverseMap();

        // RentOrderOffer mappings
        CreateMap<RentOrderOffer, RentOrderOfferDto>()
            .ConstructUsing(src => new RentOrderOfferDto(
                src.Id,
                src.RentOrderId,
                src.PartnerId,
                src.Partner != null && src.Partner.UserProfile != null ? new UserProfileDto(
                    src.Partner.UserProfile.UserId,
                    src.Partner.UserProfile.Nickname,
                    src.Partner.UserProfile.FirstName,
                    src.Partner.UserProfile.LastName,
                    src.Partner.UserProfile.Patronymic,
                    src.Partner.UserProfile.Email,
                    src.Partner.UserProfile.Birthday,
                    src.Partner.UserProfile.About,
                    src.Partner.UserProfile.Location
                ) : null,
                src.ShipId,
                src.Ship != null ? new ShipDetailsDto(
                    src.Ship.Id,
                    src.Ship.Name,
                    src.Ship.ShipTypeId,
                    src.Ship.ShipType != null ? src.Ship.ShipType.Name : string.Empty,
                    src.Ship.Capacity,
                    src.Ship.RegistrationNumber,
                    src.Ship.YearOfManufacture,
                    src.Ship.MaxSpeed,
                    src.Ship.Width,
                    src.Ship.Length,
                    src.Ship.Description,
                    src.Ship.CostPerHour,
                    src.Ship.PortId,
                    src.Ship.UserId,
                    src.Ship.ShipImages != null ? src.Ship.ShipImages.Where(img => img.IsPrimary).Select(img => img.ImagePath).FirstOrDefault() : null,
                    null // PrimaryImageMimeType will be populated later via WithBase64ImageAsync
                ) : null,
                src.OfferedPrice,
                src.Status,
                src.CreatedAt,
                src.RespondedAt
            ));

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