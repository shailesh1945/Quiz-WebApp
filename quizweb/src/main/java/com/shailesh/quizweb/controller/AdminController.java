package com.shailesh.quizweb.controller;

import com.shailesh.quizweb.dto.AdminDashboardResponse;
import com.shailesh.quizweb.dto.UserRowResponse;
import com.shailesh.quizweb.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:3000",
        allowCredentials = "true"
)
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public AdminDashboardResponse dashboard(){
        return adminService.dashboard();
    }

    @GetMapping("/users")
    public List<UserRowResponse> users(){
        return adminService.users();
    }

    @PutMapping("/users/{id}/toggle")
    public void toggle(
            @PathVariable Long id){
        adminService.toggleUser(id);
    }

    @DeleteMapping("/users/{id}")
    public void delete(
            @PathVariable Long id){
        adminService.deleteUser(id);
    }
}