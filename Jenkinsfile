pipeline {
    environment {
    REGISTRY = "sjc.vultrcr.com/lastation"
    registryCredential = 'lastation-cr'
    IMAGE_NAME = 'web-api'
    }

    agent any
    stages {
            stage('Cloning our Git') {
                steps {
                git credentialsId: 'lastation-jenkins-ssh', url:'git@github.com:KOCEAN33/lastation-web-api.git', branch: 'main'
                }
            }

            stage('Building Docker Image') {
                steps {
                    script {
                        def packageJSON = readJSON file: 'package.json'
                        def packageJSONVersion = packageJSON.version
                        env.IMAGE_VERSION = packageJSONVersion
                        echo "Build Image Version: ${env.IMAGE_VERSION}"

                        sh "docker build -t ${env.REGISTRY}/${env.IMAGE_NAME}:v${env.IMAGE_VERSION} ."
                        }
                    }
                }
            

            stage('Deploying Docker Image to Container Registry') {
                steps {
                    script {
                        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'lastation-cr', usernameVariable: 'CR_USERNAME', passwordVariable: 'CR_PASSWORD']]) {
                        sh "docker login https://sjc.vultrcr.com/lastation -u ${CR_USERNAME} -p ${CR_PASSWORD}"
                        sh "docker push ${env.REGISTRY}/${env.IMAGE_NAME}:v${env.IMAGE_VERSION}"
                        }
                    }
                }
            }

            // stage('Cleaning Up') {
            //     steps{
            //       sh "docker rmi --force $registry:$BUILD_NUMBER"
            //     }
            // }
    }
}