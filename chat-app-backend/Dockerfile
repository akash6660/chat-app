FROM amd64/openjdk:21-jdk-slim

WORKDIR /app

# Copy the JAR file from the target directory to the container
COPY target/chat-app-backend-0.0.1-SNAPSHOT.jar

# Expose the application port
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
