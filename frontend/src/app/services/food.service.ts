import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { sample_foods, sample_tags } from 'src/data';
import { FOODS_BY_SEARCH_URL, FOODS_BY_TAG_URL, FOODS_TAGS_URL, FOODS_URL, FOOD_BY_ID_URL,DASH_URL, ADD_URL } from '../shared/constants/urls';
import { Food } from '../shared/models/Food';
import { Tag } from '../shared/models/Tag';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http:HttpClient) { }







  
  getAll(): Observable<Food[]> {
    return this.http.get<Food[]>(FOODS_URL);
  }
  
  postItemApi(food: Food):Observable<Food> {
    console.log(food);
    return this.http.post<Food>(ADD_URL, food)
    
    

  }

  updateItemApi(food: Food): Observable<Food> {
    const updateUrl = `${DASH_URL}/products/${food.id}`; // Güncelleme URL'si, güncellenecek ürünün ID'sini içermelidir
    console.log(food);
    return this.http.put<Food>(updateUrl, food); // PUT isteği ile ürünü güncelleyin
  }

  deleteItemApi(id: number) {
    const deleteUrl = `${DASH_URL}/products/${id}`; // Güncelleme URL'si, güncellenecek ürünün ID'sini içermelidir
    console.log(id);
    return this.http.delete<any>(deleteUrl)
  }
  


  uploadImage(formData: FormData): Observable<any> {
    const endpoint = `${ADD_URL}`; // API'nin dosya yükleme endpoint'i
    return this.http.post(endpoint, formData);
  }


  getList(): Observable<Food[]> {
    return this.http.get<Food[]>(DASH_URL);
  }

  getAllFoodsBySearchTerm(searchTerm: string) {
    return this.http.get<Food[]>(FOODS_BY_SEARCH_URL + searchTerm);
  }

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(FOODS_TAGS_URL);
  }

  getAllFoodsByTag(tag: string): Observable<Food[]> {
    return tag === "All" ?
      this.getAll() :
      this.http.get<Food[]>(FOODS_BY_TAG_URL + tag);
  }

  getFoodById(foodId:string):Observable<Food>{
    return this.http.get<Food>(FOOD_BY_ID_URL + foodId);
  }

}
