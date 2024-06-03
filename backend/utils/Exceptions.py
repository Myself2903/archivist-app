class PermissionDeniedException(Exception):
    def __init__(self, message="user not allowed to modify project"):
        self.message = message
        super().__init__(self.message)

class ProjectNotActiveException(Exception):
    def __init__(self, message="project is not active"):
        self.message = message
        super().__init__(self.message)


class DeleteRootDependencyException(Exception):
    def __init__(self, message="cannot delete root dependency"):
        self.message = message
        super().__init__(self.message)

        
class MultipleRootDependencyException(Exception):
    def __init__(self, message="cannot create more than one root dependency in the same project"):
        self.message = message
        super().__init__(self.message)

class SelfDependenceException(Exception):
    def __init__(self, message="a dependence cant depend on itself"):
        self.message = message
        super().__init__(self.message)

class NotFoundException(Exception):
    def __init__(self, message="data not found"):
        self.message = message
        super().__init__(self.message)