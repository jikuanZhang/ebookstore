package com.example.bookstore.repository;

import com.example.bookstore.entity.PurchaseOrder;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<PurchaseOrder, Long> {

    List<PurchaseOrder> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<PurchaseOrder> findAllByOrderByCreatedAtDesc();
}
