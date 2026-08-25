package com.swiftride;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swiftride.controller.AuthController;
import com.swiftride.dto.request.LoginRequest;
import com.swiftride.dto.request.RegisterRequest;
import com.swiftride.dto.response.AuthResponse;
import com.swiftride.dto.response.UserDto;
import com.swiftride.entity.Role;
import com.swiftride.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private com.swiftride.config.JwtService jwtService;

    @MockBean
    private com.swiftride.repository.UserRepository userRepository;

    @Test
    @DisplayName("POST /api/auth/register returns 201 Created on valid input")
    void testRegisterRider() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setFirstName("Alex");
        request.setLastName("Johnson");
        request.setEmail("alex@example.com");
        request.setPassword("Password@123");

        UserDto userDto = UserDto.builder()
                .id(1L)
                .firstName("Alex")
                .lastName("Johnson")
                .email("alex@example.com")
                .role(Role.ROLE_RIDER)
                .build();

        AuthResponse response = AuthResponse.builder()
                .token("mock.jwt.token")
                .user(userDto)
                .build();

        when(authService.registerRider(any(RegisterRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("mock.jwt.token"))
                .andExpect(jsonPath("$.data.user.email").value("alex@example.com"));
    }

    @Test
    @DisplayName("POST /api/auth/login returns 200 OK on valid credentials")
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("alex@example.com");
        request.setPassword("Password@123");

        UserDto userDto = UserDto.builder()
                .id(1L)
                .firstName("Alex")
                .lastName("Johnson")
                .email("alex@example.com")
                .role(Role.ROLE_RIDER)
                .build();

        AuthResponse response = AuthResponse.builder()
                .token("mock.jwt.token")
                .user(userDto)
                .build();

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("mock.jwt.token"));
    }
}
