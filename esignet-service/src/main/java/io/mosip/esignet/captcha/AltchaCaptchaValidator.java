package io.mosip.esignet.captcha;

import io.mosip.esignet.api.spi.CaptchaValidator;
import lombok.extern.slf4j.Slf4j;
import org.altcha.altcha.Altcha;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Primary
public class AltchaCaptchaValidator implements CaptchaValidator {

    @Value("${ALTCHA_HMAC_KEY:secret-key}")
    private String hmacKey;

    @Override
    public boolean validateCaptcha(String captchaToken) {
        try {
            if (captchaToken == null || captchaToken.isEmpty()) {
                log.error("Altcha token is null or empty");
                return false;
            }
            boolean isValid = Altcha.verifySolution(captchaToken, hmacKey, true);
            log.info("Altcha captcha validation result: {}", isValid);
            return isValid;
        } catch (Exception e) {
            log.error("Altcha validation failed", e);
            return false;
        }
    }
}