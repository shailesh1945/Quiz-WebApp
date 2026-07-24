package com.shailesh.quizweb.service;


import com.shailesh.quizweb.dto.*;
import java.util.List;

public interface AdminService {

    AdminDashboardResponse dashboard();

    List<UserRowResponse> users();

    void toggleUser(Long id);

    void deleteUser(Long id);
}
