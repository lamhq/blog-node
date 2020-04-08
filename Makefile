start: docker-compose.yml ## Does docker-compose up, automaticly create docker-compose.override.yaml
	docker-compose up -d --remove-orphans
	@echo "The web app should be running on http://127.0.0.1:$$(docker-compose ps -q web | xargs docker port | cut -d':' -f2)"
	@echo "\n"

uninstall: ## Deletes all containers and volumes. WILL DROP ALL DB DATA
	docker-compose down --volumes --remove-orphans

stop: ## Stops all containers
	docker-compose stop

install: start ## Install basic data
	docker-compose exec mongo /scripts/import.sh
	@echo "Installed sample data"
	@echo "\n"
