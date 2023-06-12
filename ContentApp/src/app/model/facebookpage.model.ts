export interface FacebookPage {
  access_token: string,
  category: string,
  category_list: [
    {
      id: string,
      name: string
    }
  ],
  name: string,
  id: string,
  tasks: string[]
}
