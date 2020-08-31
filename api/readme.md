Acl

Un utilisateur peut update les entités qui le concerne /users/me
Un utilisateur a des acl définit par son role

Un admin a accès à tout
Un admin compagny peut accéder à toutes les entités de sa compagnie (exemple badge, home, etc lié à company) et les entités liées à celles-ci (exemple reports lié à home)

Accesses:
Les acl sont sous la forme lien : user, home, role,
Un user peut avoir un role différent d'une home à l'autre.
Exemple home: '1' / role: USER_ADMIN , home: '2' / role: USER_ACCESS
Un user qui a comme home: '*' a accès à toutes les homes d'une company. Son rôle est appliqué sur toutes les homes mais peut être surchargé pour une home spécifique:
Exemple: home: '*' / role: COMPANY_ADMIN , home: '1' role: USER_ACCESS


si un user à comme acl home '*' alors que filtre se base sur la company