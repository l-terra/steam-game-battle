package com.lucasterra.gamebattle.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_hall_of_fame")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HallOfFame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "game_id")
    private Game game;

    private LocalDateTime time;
}
