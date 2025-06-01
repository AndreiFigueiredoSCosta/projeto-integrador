package org.example.mirinayapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
@EnableSpringDataWebSupport
@SpringBootApplication
public class MirinayApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(MirinayApiApplication.class, args);
    }



}
