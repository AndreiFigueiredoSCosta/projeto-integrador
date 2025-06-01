package org.example.mirinayapi.utils;


public interface NumberUtils {
     static Long tryParse(String value) {
        try {
            Long parseLong = Long.parseLong(value);
            System.out.println("Valor convertido: " + parseLong);
            return parseLong;
        } catch (NumberFormatException e) {
            return null;
        }
    }


}
