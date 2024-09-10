class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  templateChildElment: HTMLFormElement;
  constructor() {
    // get the UI template with ID: project-input
    this.templateElement = document.getElementById(
      "project-input"
    ) as HTMLTemplateElement;

    // get the host UI template with ID: app
    this.hostElement = document.getElementById("app") as HTMLDivElement;

    // get the deepCopy of the template content
    const importedTempleNode = document.importNode(
      this.templateElement.content,
      true
    );

    // from the deep copy get the first Child Element
    this.templateChildElment =
      importedTempleNode.firstElementChild as HTMLFormElement;

    // AFTER GETTING THE FIRST CHLD ATTACH IT TO THE HOST ELEMENT
    this.attach();
  }
  private attach() {
    this.hostElement.insertAdjacentElement(
      "afterbegin",
      this.templateChildElment
    );
  }
}

const dragDrop = new ProjectInput();
