package com.swiftride;

import com.swiftride.controller.RootController;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = RootController.class)
@AutoConfigureMockMvc(addFilters = false)
class RootControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private com.swiftride.config.JwtService jwtService;

    @MockBean
    private com.swiftride.repository.UserRepository userRepository;

    @Test
    @DisplayName("GET / returns 200 OK with status UP and service name")
    void testRootEndpoint() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("ShafiGo Backend"));
    }

    @Test
    @DisplayName("GET /api/health returns 200 OK with status UP")
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }
}
