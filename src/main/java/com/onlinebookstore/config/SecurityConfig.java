package com.onlinebookstore.OnlineBookStore.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    // Khai báo user test trong bộ nhớ
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication()
            .withUser("testuser")
                .password(passwordEncoder().encode("123456"))
                .roles("USER")
            .and()
            .withUser("admin")
                .password(passwordEncoder().encode("admin123"))
                .roles("ADMIN");
    }

    // Cấu hình phân quyền
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .authorizeRequests()
            .antMatchers("/admin/**").hasRole("ADMIN")
            .antMatchers("/user/**").hasRole("USER")
            .antMatchers("/", "/registration", "/user-login", "/admin-login", "/login/admin").permitAll()
            .antMatchers("/views/**", "/css/**", "/js/**", "/images/**").permitAll()
            .anyRequest().authenticated()
        .and()
        .formLogin()
            .loginPage("/admin-login")   // 🟢 quan trọng: trỏ đúng file JSP
            .loginProcessingUrl("/login/admin") // 🟢 nơi form POST tới
            .defaultSuccessUrl("/admin/home", true) // 🟢 sau khi login thành công
            .permitAll()
        .and()
        .logout()
            .permitAll()
        .and()
        .csrf().disable();
}


    // Password encoder
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
