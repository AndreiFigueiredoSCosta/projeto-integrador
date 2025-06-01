package org.example.mirinayapi.utils;

public class IdConverter {
    static public String convert(Long id) {
        StringBuilder idString = new StringBuilder(id.toString());

        for (int i = 0; i < 6; i++) {
            if (idString.length() < 6) {
                idString.insert(0, "0");
            }
        }

        return idString.toString();
    }
}
