package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.util.AlquilerPagoRequest;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mercadopago.MercadoPagoConfig;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MercadoPagoController {

    @PostMapping("/mp/pagar")
    public ResponseEntity<String> generarPreferencia(@RequestBody AlquilerPagoRequest request) throws MPException, MPApiException {
        try {
            System.out.println("Request recibida: " + request);
            MercadoPagoConfig.setAccessToken("TEST-7333311989885723-062217-46c0f31cb93c6f1c78c41a822c461e68-317812925");

            // Validar precio (usar BigDecimal)
            BigDecimal precio = BigDecimal.valueOf(request.getPrecio());
            if (precio == null || precio.compareTo(BigDecimal.ZERO) <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Precio inválido");
            }

            String titulo = request.getNombre() != null && !request.getNombre().isBlank() ? request.getNombre() : "Producto";
            String descripcion = request.getDescripcion() != null ? request.getDescripcion() : "";
            String imagenUrl = request.getImagenUrl() != null && !request.getImagenUrl().isBlank() ? request.getImagenUrl() : null;

            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .id(String.valueOf(request.getId()))
                    .title(titulo)
                    .description(descripcion)
                    .pictureUrl(imagenUrl)  // Si es null, MP lo ignora
                    .quantity(1)
                    .currencyId("ARS")
                    .unitPrice(precio)
                    .build();

            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success("https://ad4e-2800-340-52-144-b609-dc3f-1b81-d345.ngrok-free.app/pago-exitoso")
                    .failure("https://ad4e-2800-340-52-144-b609-dc3f-1b81-d345.ngrok-free.app/pago-fallido")
                    .pending("https://ad4e-2800-340-52-144-b609-dc3f-1b81-d345.ngrok-free.app/pago-pendiente")
                    .build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(List.of(itemRequest))
                    .backUrls(backUrls)
                    .autoReturn("approved")
                    .build();

            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            return ResponseEntity.ok(preference.getInitPoint());
        } catch (MPApiException e) {
            String responseBody = e.getApiResponse().getContent();
            System.err.println("Error MercadoPago detalle: " + responseBody);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error de MercadoPago: " + responseBody);
        } catch (MPException e) {
            String mensajeError = e.getMessage();
            System.err.println("Error MercadoPago: " + mensajeError);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error general de MercadoPago: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error inesperado: " + e.getMessage());
        }
    }

    @GetMapping("/mp/redirect-success")
    public void redirigirASuccess(
            @RequestParam String inicio,
            @RequestParam String fin,
            @RequestParam String idMaquina,
            @RequestParam String dniCliente,
            HttpServletResponse response
    ) throws IOException {
        String url = "http://localhost:3000/pago-exitoso"
                + "?inicio=" + URLEncoder.encode(inicio, StandardCharsets.UTF_8)
                + "&fin=" + URLEncoder.encode(fin, StandardCharsets.UTF_8)
                + "&idMaquina=" + URLEncoder.encode(idMaquina, StandardCharsets.UTF_8)
                + "&dniCliente=" + URLEncoder.encode(dniCliente, StandardCharsets.UTF_8);

        response.sendRedirect(url);
    }

    @GetMapping("/mp/redirect-failure")
    public void redirigirAFailure(HttpServletResponse response) throws IOException {
        String url = "http://localhost:3000/pago-fallido";
        response.sendRedirect(url);
    }
}
