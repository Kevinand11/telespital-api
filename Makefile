APPS = api
ALL_FOLDERS = ${APPS}
args = $(filter-out $@,$(MAKECMDGOALS))

SETUP_FOLDER = /c/data/docker/telespital/traefik

setup:
	mkdir -p $(SETUP_FOLDER)
	touch $(SETUP_FOLDER)/acmeStaging.json $(SETUP_FOLDER)/acmeProduction.json
	chmod 600 $(SETUP_FOLDER)/acme*.json
	mkdir -p /c/data/docker/telespital/kafka/data
	chmod 777 /c/data/docker/telespital/kafka/data
	node bin/copy-envs.js $(APPS)

dev-start: setup
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build --remove-orphans

dev-start-detach: setup
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d --remove-orphans

dev-stop:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down --remove-orphans

dev-watch-logs:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs

prod-build: setup
	docker-compose -f docker-compose.yml build

prod-start: setup
	docker-compose -f docker-compose.yml up --remove-orphans

prod-start-detach: setup
	docker-compose -f docker-compose.yml up -d --remove-orphans

prod-stop:
	docker-compose -f docker-compose.yml down --remove-orphans

prod-watch-logs:
	docker-compose -f docker-compose.yml logs

install-all:
	$(foreach folder, $(ALL_FOLDERS), yarn --cwd ./services/$(folder) &&) echo

lint-all:
	$(foreach folder, $(ALL_FOLDERS), yarn --cwd ./services/$(folder) lint &&) echo

build-all:
	$(foreach folder, $(ALL_FOLDERS), yarn --cwd ./services/$(folder) build &&) echo
