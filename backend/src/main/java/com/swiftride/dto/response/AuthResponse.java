package com.swiftride.dto.response;

public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private UserDto user;
    private DriverDto driver;

    public AuthResponse() {}

    public AuthResponse(String token, UserDto user, DriverDto driver) {
        this.token = token;
        this.tokenType = "Bearer";
        this.user = user;
        this.driver = driver;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private String tokenType = "Bearer";
        private UserDto user;
        private DriverDto driver;

        public Builder token(String token) { this.token = token; return this; }
        public Builder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
        public Builder user(UserDto user) { this.user = user; return this; }
        public Builder driver(DriverDto driver) { this.driver = driver; return this; }

        public AuthResponse build() {
            AuthResponse res = new AuthResponse();
            res.setToken(token);
            res.setTokenType(tokenType);
            res.setUser(user);
            res.setDriver(driver);
            return res;
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

    public DriverDto getDriver() { return driver; }
    public void setDriver(DriverDto driver) { this.driver = driver; }
}
