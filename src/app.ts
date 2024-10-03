class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  templateChildElment: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;
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
    console.log("child", this.templateChildElment);
    this.templateChildElment.id = "user-input";
    // AFTER GETTING THE FIRST CHLD ATTACH IT TO THE HOST ELEMENT
    this.attach();

    // get the input fields from the child element i.e. form
    this.titleInputElement = this.templateChildElment.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionElement = this.templateChildElment.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.templateChildElment.querySelector(
      "#people"
    ) as HTMLInputElement;

    // add the configure setting to instance/class
    this.configure();
  }

  // Attach the template form-input to the hostElement
  private attach() {
    this.hostElement.insertAdjacentElement(
      "afterbegin",
      this.templateChildElment
    );
  }

  // Configure the form submit event handler with bind
  private configure() {
    this.templateChildElment.addEventListener(
      "submit",
      this.submitHandler.bind(this)
    );
  }

  // form submithandler function
  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this.gatherUserInputs());
  }

  // gather the user inputs
  private gatherUserInputs(): [string, string, number] | void {
    const title = this.titleInputElement.value;
    const description = this.descriptionElement.value;
    const people = this.peopleInputElement.value;

    //check if empty
    if (
      title.trim().length == 0 ||
      description.trim().length === 0 ||
      people.trim().length == 0
    ) {
      alert("Invalid Input, please try again!");
      return;
    } else {
      this.clearInput();
      return [title, description, +people];
    }
  }

  // function to clear the input once submit handler is done, correctly
  private clearInput(): void {
    this.titleInputElement.value = "";
    this.descriptionElement.value = "";
    this.peopleInputElement.value = "";
  }
}

const dragDrop = new ProjectInput();
