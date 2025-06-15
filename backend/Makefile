.PHONY: help setup check-nvm check-corepack install-node install-pnpm install-deps create-env docker-up migrate start stop clean

# Environment
SHELL := /bin/bash
TERM := xterm-256color
export TERM

# Variables
PNPM_VERSION := 10.9.0
NODE_VERSION := 22
NVM_DIR := $(shell echo $$HOME/.nvm)
NVM_SCRIPT := $(NVM_DIR)/nvm.sh
DB_HOST ?= localhost
DB_PORT ?= 5432
DB_USER ?= postgres
DB_PASS ?= postgres
DB_NAME ?= datawow_test
APP_PORT ?= 8000

# Colors (using ANSI escape sequences)
GREEN := $(shell printf '\033[32m')
RED := $(shell printf '\033[31m')
YELLOW := $(shell printf '\033[33m')
BLUE := $(shell printf '\033[34m')
CYAN := $(shell printf '\033[36m')
NC := $(shell printf '\033[0m')

# Symbols
CHECK = $(GREEN)✓$(NC)
CROSS = $(RED)✗$(NC)

help: ## Show this help message
	@printf "Concert Booking System Backend Development Setup\n\n"
	@printf "Usage:\n"
	@printf "  make $(CYAN)<target>$(NC)\n\n"
	@printf "Targets:\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-20s$(NC) %s\n", $$1, $$2}'

check-nvm: ## Check if nvm is installed
	@if [ ! -f "$(NVM_SCRIPT)" ]; then \
		printf "$(CROSS) nvm is not installed\n"; \
		printf "Please install nvm from: https://github.com/nvm-sh/nvm#installing-and-updating\n"; \
		exit 1; \
	fi
	@. $(NVM_SCRIPT) && command -v nvm >/dev/null 2>&1 || { \
		printf "$(CROSS) nvm is not properly loaded\n"; \
		printf "Please ensure nvm is properly sourced in your shell\n"; \
		exit 1; \
	}
	@printf "$(CHECK) nvm is installed and working\n"

check-corepack: ## Check and install corepack if needed
	@command -v corepack >/dev/null 2>&1 || { \
		printf "📦 Installing corepack...\n"; \
		npm install -g corepack; \
	}
	@printf "$(CHECK) corepack is installed\n"
	@corepack enable

install-node: check-nvm ## Install and use the correct Node.js version
	@printf "📦 Installing and switching to Node.js $(NODE_VERSION)...\n"
	@. $(NVM_SCRIPT) && nvm install $(NODE_VERSION)
	@. $(NVM_SCRIPT) && nvm use $(NODE_VERSION)
	@printf "$(CHECK) Node.js $(shell node -v) is active\n"

install-pnpm: check-corepack ## Install/upgrade pnpm to the correct version
	@printf "📦 Installing/upgrading pnpm...\n"
	@corepack prepare pnpm@$(PNPM_VERSION) --activate
	@printf "$(CHECK) pnpm $(shell pnpm -v) is installed\n"

install-deps: ## Install project dependencies
	@printf "📦 Installing project dependencies...\n"
	@pnpm install
	@printf "$(CHECK) Dependencies installed\n"

create-env: ## Create .env file if it doesn't exist
	@if [ ! -f .env ]; then \
		echo "$(BLUE)Creating .env file from example...$(NC)"; \
		cp .env.example .env; \
		echo "$(GREEN)✓ Created .env file$(NC)"; \
	fi

docker-up: ## Start Docker containers
	@echo "$(BLUE)Starting database container...$(NC)"
	@docker compose up -d
	@echo "$(GREEN)✓ Database container started$(NC)"
	@echo "$(BLUE)Waiting for PostgreSQL to be ready...$(NC)"
	@until docker exec datawow_postgres pg_isready > /dev/null 2>&1; do \
		echo "Waiting for database..."; \
		sleep 2; \
	done
	@echo "$(GREEN)✓ Database is ready$(NC)"

migrate: ## Run database migrations
	@echo "$(BLUE)Running database migrations...$(NC)"
	@pnpm run migration:run
	@echo "$(GREEN)✓ Migrations completed$(NC)"

setup: install-node install-pnpm create-env install-deps docker-up migrate ## Setup complete development environment
	@printf "\n$(GREEN)✅ Development environment setup complete!$(NC)\n"

.DEFAULT_GOAL := help