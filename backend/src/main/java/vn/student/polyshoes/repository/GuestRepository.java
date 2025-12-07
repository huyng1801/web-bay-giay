package vn.student.polyshoes.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import vn.student.polyshoes.model.Guest;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Integer> {
}