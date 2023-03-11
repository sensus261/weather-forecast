#!/bin/sh

# Function to print a message using unicode characters
last_chain_index=0

print_message() {
    message=$1
    unicode=$2

    len=${#message}
    num_chars=$(($len - 4))

    if [ $last_chain_index -ne 0 ]; then
        half_num_chars=$(($last_chain_index))
    else
        half_num_chars=$(($len / 2))
    fi

    last_chain_index=$(($len / 2))

    top_border=$(printf '═%.0s' $(seq 1 $num_chars))
    bottom_border=$(printf '═%.0s' $(seq 1 $num_chars))
    top_chains_space=$(printf ' %.0s' $(seq 1 $half_num_chars))
    bottom_chains_space=$(printf ' %.0s' $(seq 1 $last_chain_index))

    echo "$top_chains_space⛓$top_chains_space"
    echo "$top_chains_space⛓$top_chains_space"
    echo "╔═.$unicode.$top_border.═╗"
    echo "   $message"
    echo "╚═.$bottom_border.$unicode.═╝"
    echo "$bottom_chains_space⛓$bottom_chains_space"
    echo "$bottom_chains_space⛓$bottom_chains_space"

    sleep 1
}

# Function to handle errors
handle_error() {
    app=$1
    step=$2

    print_message "❌ [PRE-COMMIT] Error while executing step '$step' for application '$app'." "✘"
    exit 1
}

# Function to modify the .env files
modify_env_file() {
    app=$1
    from=$2
    to=$3
    env=$4

    docker-compose exec -T $app /bin/sh -c "sed -i 's/$from/$to/g' $env"
}

# Function to run tests
run_tests() {
    app=$1
    command=$2
    env=$3

    print_message "⌛ [PRE-COMMIT] Running tests for $app... " "⚡"

    docker-compose exec -T $app yarn $command
    if [ $? -ne 0 ]; then
        modify_env_file $app "dockerhost" "localhost" $env
        handle_error $app "Running $command"
    fi
}

# Function to run lint
run_lint() {
    app=$1

    print_message "⌛ [PRE-COMMIT] Running the linter for $app... " "🔍"

    docker-compose exec -T $app yarn lint
    if [ $? -ne 0 ]; then
        handle_error $app "Linting and fixing project"
    fi
}

# Function to handle backend hooks
handle_backend_hooks() {
    print_message "✨ [PRE-COMMIT] Starting pre-commit hooks for backend!" "✨"

    # Specify the directory to be watched
    backend_dir=backend/src

    # Get the list of files in the directory that have been modified in the current commit
    backend_files_changed=$(git diff --cached --name-only | grep "^$backend_dir/")

    if [ -z "$backend_files_changed" ]; then
        # If there are no changed files skip backend hooks
        print_message "✅ [PRE-COMMIT] No backend changes. No need to run the hooks for backend." "✔"
        return
    fi

    # Modify the env.test file (localhost => dockerhost)
    modify_env_file "backend" "localhost" "dockerhost" ".env.test"

    # Bootstrap the database
    print_message "⌛ [PRE-COMMIT] Bootstrapping the test database prior to testing..." "⏳"

    docker-compose exec -T backend yarn bootstrap:tests >/dev/null
    if [ $? -ne 0 ]; then
        modify_env_file "backend" "dockerhost" "localhost" ".env.test"
        handle_error "backend" "1. Bootstrapping the test database"
    fi

    # Run tests
    run_tests "backend" "test" ".env.test"

    # Revert the env file (dockerhost => localhost)
    modify_env_file "backend" "dockerhost" "localhost" ".env.test"

    # Run lint
    run_lint "backend"

    print_message "✅ [PRE-COMMIT] The hooks were executed successfully on backend!" "✨"
}

handle_frontend_hooks() {
    print_message "✨ [PRE-COMMIT] Starting pre-commit hooks for frontend!" "✨"

    # Specify the directory to be watched
    backend_dir=backend/src

    # Get the list of files in the directory that have been modified in the current commit
    backend_files_changed=$(git diff --cached --name-only | grep "^$backend_dir/")

    if ! [ -z "$backend_files_changed" ]; then
        print_message "⌛ [PRE-COMMIT] Regenerating GraphQL types..." "⌛"

        # Modify the env.test file (localhost => dockerhost)
        modify_env_file "frontend" "localhost" "dockerhost" ".env"

        # Run codegen
        docker-compose exec -T frontend yarn codegen
        if [ $? -ne 0 ]; then
            # Revert the env file (dockerhost => localhost)
            modify_env_file "frontend" "dockerhost" "localhost" ".env"
            handle_error "frontend" "1. GraphQL schema types regeneration"
        fi

        # Run lint
        run_lint "frontend"

        # Add the generated files to the commit
        git add $(git ls-files | grep 'graphql.ts$')

        # Revert the env file (dockerhost => localhost)
        modify_env_file "frontend" "dockerhost" "localhost" ".env"
    fi

    # Specify the directory to be watched
    frontend_dir=frontend/src

    # Get the list of files in the directory that have been modified in the current commit
    frontend_files_changed=$(git diff --cached --name-only | grep "^$frontend_dir/")

    if [ -z "$frontend_files_changed" ]; then
        # If there are no changed files skip backend hooks
        print_message "✅ [PRE-COMMIT] No frontend changes. No need to run the hooks for frontend!" "✔"
        return
    fi

    # Run tests
    run_tests "frontend" "test" ".env"

    # Run lint
    run_lint "frontend"

    print_message "✅ [PRE-COMMIT] The hooks were executed successfully on frontend!" "✨"
}

handle_backend_hooks
handle_frontend_hooks

print_message "✨ [PRE-COMMIT] Finished! Your commit has been made!" "✨"
