package com.BobElAlquilador.demo.controller;

import com.BobElAlquilador.demo.model.Maquina;
import com.BobElAlquilador.demo.model.Marca;
import com.BobElAlquilador.demo.model.Tipo;
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
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/")
public class FrontController {
    @Autowired
    private MarcaService marcaService;
    @Autowired
    private TipoService tipoService;

    @GetMapping("/api/tipos")
    public List<Tipo> getTipos() {
        return tipoService.getAllTipos(); // O como sea tu método
    }
    @GetMapping("/api/marcas")
    public List<Marca> getMarcas() {
        return marcaService.getAllMarcas(); // O como sea tu método
    }


}
