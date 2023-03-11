#!/bin/sh

## TODO (BIG): Rewrite this mess...

# Error handler function
handle_error() {
    local app=$1
    local step=$2

    echo "\n❌ [PRE-COMMIT] Error while executing step '$step' for application '$app'."
    exit 1
}

handle_backend_hooks() {
    {
        echo "\n\n\n"
        echo "╔═.✾. ═══════════════════════════════════════════════════════╗"
        echo "    ✨ [PRE-COMMIT] Starting pre-commit hooks for backend!"
        echo "╚═══════════════════════════════════════════════════════.✾. ═╝"

        # Specify the directory to be watched
        backend_dir=backend/src

        # Get the list of files in the directory that have been modified in the current commit
        backend_files_changed=$(git diff --cached --name-only | grep "^$backend_dir/")

        if [ -z "$backend_files_changed" ]; then
            # If there are no changed files skip backend hooks
            echo "\n✅ [PRE-COMMIT] No backend changes. No need to run the hooks for backend."
            return
        fi

        sleep 3

        # Modify the env.test file (localhost => dockerhost)
        docker-compose exec -T backend /bin/sh -c "sed -i 's/localhost/dockerhost/g' .env.test"

        # Bootstrap the database
        echo "\n⌛ [PRE-COMMIT] Bootstrapping the test database prior to testing... \n"
        docker-compose exec -T backend yarn bootstrap:tests >/dev/null
        if [ $? -ne 0 ]; then
            # Revert the env file (dockerhost => localhost)
            docker-compose exec -T backend /bin/sh -c "sed -i 's/dockerhost/localhost/g' .env.test"
            handle_error "backend" "1. Bootstrapping the test database"
        fi
        sleep 2

        # Run tests
        echo "\n⌛ [PRE-COMMIT] Running the tests... \n"
        docker-compose exec -T backend yarn test
        if [ $? -ne 0 ]; then
            # Revert the env.test file (dockerhost => localhost)
            docker-compose exec -T backend /bin/sh -c "sed -i 's/dockerhost/localhost/g' .env.test"
            handle_error "backend" "2. Running the tests"
        fi
        sleep 2

        # Revert the env file (dockerhost => localhost)
        docker-compose exec -T backend /bin/sh -c "sed -i 's/dockerhost/localhost/g' .env.test"

        # Run lint
        echo "\n⌛ [PRE-COMMIT] Running the linter... \n"
        docker-compose exec -T backend yarn lint
        if [ $? -ne 0 ]; then
            handle_error "backend" "3. Linting and fixing project"
        fi
        sleep 2

        echo "\n✅ [PRE-COMMIT] The hooks were executed successfully on backend! \n"
        sleep 2
    } || {
        handle_error "backend" "Backend project hooks"
    }
}

handle_frontend_hooks() {
    {
        echo "\n\n\n"
        echo "╔═.✾. ══════════════════════════════════════════════════════╗"
        echo "   ✨ [PRE-COMMIT] Starting pre-commit hooks for frontend!"
        echo "╚═══════════════════════════════════════════════════════✾. ═╝"

        # Modify the env file (localhost => dockerhost)
        docker-compose exec -T frontend /bin/sh -c "sed -i 's/localhost/dockerhost/g' .env"

        # Specify the directory to be watched
        backend_dir=backend/src

        # Get the list of files in the directory that have been modified in the current commit
        backend_files_changed=$(git diff --cached --name-only | grep "^$backend_dir/")

        if ! [ -z "$backend_files_changed" ]; then
            # If there are no scheam files changed, exit the script
            echo "\n✨ [PRE-COMMIT] Backend changes detected.. attempting to regenerate GraphQL types.."
            sleep 2

            # Run codegen
            echo "\n⌛ [PRE-COMMIT] Generating GraphQL schema types for frontend... \n"
            docker-compose exec -T frontend yarn codegen
            if [ $? -ne 0 ]; then
                # Revert the env file (dockerhost => localhost)
                docker-compose exec -T frontend /bin/sh -c "sed -i 's/dockerhost/localhost/g' .env"

                handle_error "frontend" "1. GraphQL schema types regeneration"
            fi
            sleep 2
        else
            echo "\n✨ [PRE-COMMIT] No backend changes. No need to regen the types on frontend."
        fi

        # Specify the directory to be watched
        frontend_dir=frontend/src

        # Get the list of files in the directory that have been modified in the current commit
        frontend_files_changed=$(git diff --cached --name-only | grep "^$frontend_dir/")

        if [ -z "$frontend_files_changed" ]; then
            # Revert the env file (dockerhost => localhost)
            docker-compose exec -T frontend /bin/sh -c "sed -i 's/dockerhost/localhost/g' .env"

            # If there are no changed files skip backend hooks
            echo "\n✅ [PRE-COMMIT] No frontend changes. No need to run the hooks for frontend."
            return
        fi

        sleep 3

        # Run tests
        echo "\n⌛ [PRE-COMMIT] Running the tests... \n"
        docker-compose exec -T frontend yarn test
        if [ $? -ne 0 ]; then
            # Revert the env file (dockerhost => localhost)
            docker-compose exec -T frontend /bin/sh -c "sed -i 's/dockerhost/localhost/g' .env"

            handle_error "frontend" "2. Running the tests"
        fi
        sleep 2

        # Revert the env file (dockerhost => localhost)
        docker-compose exec -T frontend /bin/sh -c "sed -i 's/dockerhost/localhost/g' .env"

        # Run lint
        echo "\n⌛ [PRE-COMMIT] Running the linter... \n"
        docker-compose exec -T frontend yarn lint
        if [ $? -ne 0 ]; then
            handle_error "frontend" "3. Linting and fixing project"
        fi
        sleep 2

        # Add the generated files to the commit
        git add $(git ls-files | grep 'graphql.ts$')

        echo "\n✅ [PRE-COMMIT] The hooks were executed successfully on frontend! \n"
        sleep 2
    } || {
        # Revert the env file (dockerhost => localhost)
        docker-compose exec -T frontend /bin/sh -c "sed -i 's/dockerhost/localhost/g' .env"
        handle_error "frontend" "Frontend project hooks"
    }
}

handle_backend_hooks
handle_frontend_hooks

echo "\n\n\n"
echo "╔═.✾. ══════════════════════════════════════════════════════╗"
echo "    ✨ [PRE-COMMIT] The hook execution was successful! ✨"
echo "╚═══════════════════════════════════════════════════════✾. ═╝"
exit 0
