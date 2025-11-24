# Archivo de salida
OUT_FILE := context_ia.xml

# Directorios y archivos específicos que queremos escanear
TARGETS := .docker apps libs docker-compose* nest-cli.json package.json README.md

.PHONY: context help clean

help:
	@echo "Comandos:"
	@echo "  make context  -> Genera contexto respetando .gitignore"
	@echo "  make clean    -> Elimina el archivo generado"

context:
	@echo "🚀 Generando contexto desde GIT (respetando .gitignore)..."
	@echo "<project_context>" > $(OUT_FILE)
	@{ \
		git ls-files $(TARGETS); \
		git ls-files --others --exclude-standard $(TARGETS); \
	} | sort | uniq | grep -vE "package-lock.json|yarn.lock" | while read filepath; do \
		echo "  -> Procesando: $$filepath"; \
		echo "<file path=\"$$filepath\">" >> $(OUT_FILE); \
		sed '/^[[:blank:]]*\/\//d' "$$filepath" \
		| sed '/^[[:blank:]]*$$/d' \
		| sed 's/[[:blank:]]*$$//' \
		>> $(OUT_FILE); \
		echo "</file>" >> $(OUT_FILE); \
	done
	@echo "</project_context>" >> $(OUT_FILE)
	@echo "✅ Archivo generado: $(OUT_FILE) (Optimizado y sin archivos ignorados)"


clean:
	@rm -f $(OUT_FILE)
	@echo "🗑️  Archivo $(OUT_FILE) eliminado."