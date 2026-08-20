package com.swiftride.dto.request;

import com.swiftride.entity.DriverOnlineStatus;
import jakarta.validation.constraints.NotNull;

public class DriverStatusUpdateDto {

    @NotNull(message = "Online status is required")
    private DriverOnlineStatus onlineStatus;

    public DriverStatusUpdateDto() {}
    public DriverStatusUpdateDto(DriverOnlineStatus onlineStatus) {
        this.onlineStatus = onlineStatus;
    }

    public DriverOnlineStatus getOnlineStatus() { return onlineStatus; }
    public void setOnlineStatus(DriverOnlineStatus onlineStatus) { this.onlineStatus = onlineStatus; }
}
