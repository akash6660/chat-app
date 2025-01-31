package com.substring.chat.entities;
import lombok.*;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document (collection = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
 private String id;      //mongo db unique identifier
 private String roomId;


  private List<Message> messages =new ArrayList<>();




}
