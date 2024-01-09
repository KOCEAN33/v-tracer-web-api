pipeline {
    environment {
    REGISTRY = "sjc.vultrcr.com/xanny"
    registryCredential = 'xanny-cr-credentials'
    IMAGE_NAME = 'web-api'
    }

    agent any
    stages {
            stage('Cloning web-api Git') {
                steps {
                git credentialsId: 'v-tracer-web-api-jenkins-ssh', url:'git@github.com:KOCEAN33/v-tracer-web-api.git', branch: 'main'
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
                        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'xanny-cr-credentials', usernameVariable: 'CR_USERNAME', passwordVariable: 'CR_PASSWORD']]) {
                        sh "docker login https://sjc.vultrcr.com/xanny -u ${CR_USERNAME} -p ${CR_PASSWORD}"
                        sh "docker push ${env.REGISTRY}/${env.IMAGE_NAME}:v${env.IMAGE_VERSION}"
                        }
                    }
                }
            }

         stage('Cleaning ') {
                 steps{
                     deleteDir()
                 }
             }

         stage('Git clone') {
             steps{
               git credentialsId: 'v-tracer-gitops-jenkins-ssh', url:'git@github.com:KOCEAN33/v-tracer-gitops.git', branch: 'main'
             }
         }

         stage('Update GitOps File') {
             steps {
                 script {

                     def filename = "environments/production/web-api/kustomization.yaml"
                     def data = readYaml file: filename

                     // Change Data
                     data.images[0].newTag = "v${env.IMAGE_VERSION}"

                     sh "rm $filename"
                     writeYaml file: filename, data: data

                 }
             }
         }

         stage('Push git') {
             steps {

                 sshagent(credentials: ['v-tracer-gitops-jenkins-ssh']) {
                 sh"""

                 git add .
                 git commit -m "UPDATE: web-api image v${env.IMAGE_VERSION} (jenkins automatically)"
                 git push origin main

                 """
                 }
             }
         }
    }
}