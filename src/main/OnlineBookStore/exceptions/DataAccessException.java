package com.onlinebookstore.OnlineBookStore.exceptions;

public class DataAccessException extends RuntimeException {

    public DataAccessException(String message) {
        super(message);
    }
	
    private static final long serialVersionUID = 1L;

    public DataAccessException(String message, Throwable cause) {
        super(message, cause);
    }

}
