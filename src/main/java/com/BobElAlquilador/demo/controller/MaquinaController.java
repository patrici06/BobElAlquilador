package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.EstadoMaquina;
import com.BobElAlquilador.demo.model.Maquina;
import com.BobElAlquilador.demo.model.Marca;
import com.BobElAlquilador.demo.model.Tipo;
import com.BobElAlquilador.demo.service.MaquinaAlquilerCordinator;
import com.BobElAlquilador.demo.service.MaquinaService;
import com.BobElAlquilador.demo.service.MarcaService;
import com.BobElAlquilador.demo.service.TipoService;
import com.BobElAlquilador.demo.util.MaquinaRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/")
public class MaquinaController {
    @Autowired
    private MaquinaService maquinaService;
    @Value("${upload.dir}")
    private String uploadDir;
    @Autowired
    private MaquinaAlquilerCordinator maquinaAlquilerCordinator;
    @Autowired
    private TipoService tiposService;
    @Autowired
    private MarcaService marcaService;
    @PostMapping("/propietario/subirMaquina")
    public ResponseEntity<?> subirMaquina(@ModelAttribute MaquinaRequest maquinaRequest) {
        try {
            // Ahora el método subir recibe el objeto MaquinaRequest completo (camelCase)
            String filename  = System.currentTimeMillis() + "_" + StringUtils.cleanPath(maquinaRequest.getFoto().getOriginalFilename());
            Path path = Paths.get(uploadDir, filename);
            Files.createDirectories(path.getParent());
            maquinaRequest.getFoto().transferTo(path);
            String fileDownloadUri = "/images/" + filename;// esto depende de tu configuración de static resource

            Set<Tipo> tiposFiltrados = tiposService.getAllTipos().stream()
                    .filter(tipo -> maquinaRequest.getTiposIds().contains(tipo.getId()))
                    .collect(Collectors.toSet());
            if (tiposFiltrados.isEmpty()) {
                throw new RuntimeException("Tipo no encontrado");
            }Marca marca = marcaService.getMarcaById(maquinaRequest.getMarcaId()).orElse(null);
            if(marca == null){ throw new RuntimeException("Marca no encontrada");}
            Maquina nueva = maquinaService.subir(maquinaRequest.getNombreMaquina(),
                    maquinaRequest.getUbicacion(),
                    maquinaRequest.getFechaIngreso(),
                    fileDownloadUri,
                    maquinaRequest.getDescripcion(),
                    tiposFiltrados,
                    maquinaRequest.getPrecioDia(),
                    marca,
                    maquinaRequest.getPorcentajeReembolso()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
        } catch (Exception e) {
            System.out.println("Mensaje de Error" + e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Error al subir maquina: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/api/maquinas")
    public ResponseEntity<?> obtenerMaquinas() {
        try {
            return ResponseEntity.ok(maquinaService.getAllMaquinas());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener máquinas: " + e.getMessage());
        }
    }

    @GetMapping("/api/maquinas/disponibles")
    public ResponseEntity<?> obtenerMaquinasDisponibles() {
        try {
            return ResponseEntity.ok(maquinaService.getMaquinasDisponibles());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener máquinas: " + e.getMessage());
        }
    }

    // Este metodo usa el nombre de la maq, pero es completamente arbitrario, cambiar a conveniencia
    // siempre teniendo en cuenta las repercusiones dentro de maquinaService
    @DeleteMapping("/maquina/eliminar/{nombre}")
    public ResponseEntity<?> eliminarMaquina(@PathVariable String nombre) {
        try {
            maquinaAlquilerCordinator.eliminarMaquinaConCancelacion(nombre);
            return ResponseEntity.status(HttpStatus.OK).body("Máquina '" + nombre + "' eliminada con éxito.");
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Error al eliminar maquina" + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/api/maquina/actualizarEstado/{nombre}")
    public ResponseEntity<?> cambiarEstadoMaquina(@RequestParam String nuevoEstado, @PathVariable String nombre) {
        try {
            EstadoMaquina estado = EstadoMaquina.valueOf(nuevoEstado);
            maquinaService.actualizarEstadoMaquina(nombre, estado);
            return ResponseEntity.status(HttpStatus.OK).body("Estado de maquina '" + nombre + "' actualizado con éxito.");
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("mensaje", "Error al cambiar el estado de la maquina: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}