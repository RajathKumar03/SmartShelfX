package com.smartshelfx.SmartShelfX.repository;

import com.smartshelfx.SmartShelfX.model.Product;
import com.smartshelfx.SmartShelfX.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByUser(User user);
}
