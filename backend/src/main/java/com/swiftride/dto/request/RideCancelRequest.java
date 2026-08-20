package com.swiftride.dto.request;

public class RideCancelRequest {

    private String reason;

    public RideCancelRequest() {}
    public RideCancelRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
