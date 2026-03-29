package backend.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(99999, "Uncategorized error"),
    INVALID_KEY(1001, "Invalid massage key"),
    USER_EXISTED(1002, "User existed"),
    USERNAME_INVALID(1003, "Username must be at least 3 characters"),
    PASSWORD_INVALID(1004, "Password must be at least 8 characters"),
    USERNAME_NOT_EXISTED(1003, "User not existed"),
    UNAUTHENTICATED(1006, "Unauthenticated")
    ;
    private int code;
    private String message;
}
