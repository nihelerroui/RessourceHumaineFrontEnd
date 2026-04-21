# HR & Finance Management System

## Description du projet

HR & Finance Management System est une application web full-stack destinée à la gestion des contrats, factures, trésorerie et indicateurs financiers d’une entreprise.

Le système permet de digitaliser les processus financiers, de suivre les paiements, de gérer les contrats clients et sous-traitants, et de fournir des analyses avancées pour la prise de décision.

---

## Architecture

- Frontend : Angular
- Backend : Spring Boot (API REST)
- Base de données : MySQL
- Authentification : JWT

---

## Rôles utilisateurs

### Responsable financier
- Consulter les contrats clients et sous-traitants
- Gérer les prestations (CRUD + recherche)
- Gérer les factures clients (CRUD + téléchargement + recherche)
- Valider le paiement des factures
- Gérer les commentaires (factures et contrats)
- Gérer les chiffres d’affaires (filtrage + graphiques)
- Gérer la trésorerie (entrées/sorties + historique + solde initial)
- Envoyer des e-mails (rappels factures, liens sécurisés)

---

### Administrateur
Hérite des fonctionnalités du responsable financier et peut en plus :

- Valider / rejeter contrats clients et sous-traitants
- Valider / rejeter factures clients
- Gérer le solde initial de trésorerie
- Consulter un tableau de bord avancé :
  - KPI financiers (CA, contrats, factures à valider)
  - Analyse de rentabilité client
  - Score de fiabilité client
  - Analyse de trésorerie et investissement
  - Recommandations financières

---

### Client
- Gérer ses contrats clients (CRUD)
- Gérer ses commentaires sur contrats et factures

---

### Sous-traitant
- Consulter ses contrats sous-traitants
- Gérer ses commentaires sur contrats

---

## Fonctionnalités principales

### 📁 Gestion des contrats
- Clients & sous-traitants
- Validation / rejet
- Commentaires collaboratifs

### 💰 Gestion des factures
- Création / modification / suppression
- Téléchargement
- Validation de paiement
- Commentaires

### 📈 Analyse financière
- Chiffre d’affaires par année
- Graphiques d’évolution
- KPI financiers

### 💳 Trésorerie
- Entrées / sorties
- Historique bancaire
- Solde initial
- Analyse de flux

### 📧 Système d’e-mails
- Rappels automatiques de factures
- Envoi de liens sécurisés

### 📊 Tableau de bord (Admin)
- KPI financiers globaux
- Rentabilité client
- Score de fiabilité client
- Analyse investissement & prévision

---

## Stack technique

### Frontend
- Angular
- TypeScript
- HTML / CSS
- Chart.js
- Bootstrap / Angular Material

### Backend
- Spring Boot
- Spring Data JPA
- Spring Security
- REST APIs

### Base de données
- MySQL

---

## Communication Frontend / Backend

- API REST sécurisées
- JSON exchange
- Authentification par token 

---
