import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// Örnek kurs içerikleri - gerçek uygulamada veritabanında olacak
const getCourseContents = (courseId: number) => {
  const contents = [
    {
      id: 1,
      courseId: courseId,
      title: "Giriş ve Kurulum",
      description: "Temel kavramlar ve gerekli araçların kurulumu",
      type: "video" as const,
      content: `
        <h3>Kurs Hakkında</h3>
        <p>Bu kursta aşağıdaki konuları öğreneceksiniz:</p>
        <ul>
          <li>Temel kavramlar ve terminoloji</li>
          <li>Gerekli araçların kurulumu ve yapılandırması</li>
          <li>İlk proje oluşturma</li>
          <li>Kod yazma standartları</li>
        </ul>
        
        <h3>Ön Gereksinimler</h3>
        <p>Bu kursu takip edebilmek için:</p>
        <ul>
          <li>Temel bilgisayar kullanımı</li>
          <li>İnternet bağlantısı</li>
          <li>Öğrenme motivasyonu</li>
        </ul>
        
        <h3>Kurulacak Araçlar</h3>
        <p>Kurs boyunca kullanacağımız araçlar:</p>
        <ul>
          <li>Visual Studio Code</li>
          <li>Node.js</li>
          <li>Git</li>
          <li>Web tarayıcısı</li>
        </ul>
      `,
      duration: 15,
      order: 1
    },
    {
      id: 2,
      courseId: courseId,
      title: "Temel Kavramlar",
      description: "Öğrenmemiz gereken temel kavramları inceleyelim",
      type: "text" as const,
      content: `
        <h3>Temel Kavramlar</h3>
        
        <h4>1. Değişkenler</h4>
        <p>Değişkenler, verileri saklamamızı sağlayan temel yapı taşlarıdır. Farklı türlerde veriler saklayabiliriz:</p>
        <ul>
          <li><strong>String:</strong> Metin verileri için</li>
          <li><strong>Number:</strong> Sayısal veriler için</li>
          <li><strong>Boolean:</strong> Doğru/yanlış değerleri için</li>
          <li><strong>Array:</strong> Listeler için</li>
          <li><strong>Object:</strong> Karmaşık veri yapıları için</li>
        </ul>
        
        <h4>2. Fonksiyonlar</h4>
        <p>Fonksiyonlar, belirli işlemleri gerçekleştiren kod bloklarıdır. Tekrar kullanılabilir ve düzenli kod yazmamızı sağlar.</p>
        
        <h4>3. Koşullar</h4>
        <p>if/else yapıları ile kodumuzda farklı durumlar için farklı işlemler gerçekleştirebiliriz.</p>
        
        <h4>4. Döngüler</h4>
        <p>for ve while döngüleri ile tekrarlı işlemleri otomatikleştirebiliriz.</p>
        
        <h3>Kod Örnekleri</h3>
        <pre><code>
// Değişken tanımlama
let name = "Ahmet";
let age = 25;
let isStudent = true;

// Fonksiyon tanımlama
function greetUser(name) {
    return "Merhaba " + name + "!";
}

// Koşul kullanımı
if (age >= 18) {
    console.log("Yaş uygun");
} else {
    console.log("Yaş uygun değil");
}
        </code></pre>
      `,
      duration: 25,
      order: 2
    },
    {
      id: 3,
      courseId: courseId,
      title: "İlk Proje",
      description: "Öğrendiklerimizi kullanarak ilk projemizi oluşturalım",
      type: "video" as const,
      content: `
        <h3>İlk Projemizi Oluşturalım</h3>
        
        <p>Bu bölümde, öğrendiğimiz temel kavramları kullanarak basit bir proje oluşturacağız.</p>
        
        <h4>Proje Özellikleri:</h4>
        <ul>
          <li>Kullanıcı girişi alma</li>
          <li>Veri işleme</li>
          <li>Sonuç gösterme</li>
          <li>Hata kontrolü</li>
        </ul>
        
        <h4>Adım Adım Uygulama:</h4>
        <ol>
          <li><strong>Proje klasörü oluşturma:</strong> Çalışma alanımızı düzenleme</li>
          <li><strong>HTML yapısı:</strong> Temel sayfa yapısını oluşturma</li>
          <li><strong>CSS stillemesi:</strong> Görünümü iyileştirme</li>
          <li><strong>JavaScript mantığı:</strong> İşlevsellik ekleme</li>
          <li><strong>Test etme:</strong> Projeyi çalıştırma ve kontrol etme</li>
        </ol>
        
        <h3>Örnek Kod Yapısı</h3>
        <pre><code>
// index.html
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;İlk Projem&lt;/title&gt;
    &lt;link rel="stylesheet" href="style.css"&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;div id="app"&gt;
        &lt;h1&gt;Merhaba Dünya!&lt;/h1&gt;
        &lt;button onclick="showMessage()"&gt;Tıkla&lt;/button&gt;
    &lt;/div&gt;
    &lt;script src="script.js"&gt;&lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;
        </code></pre>
        
        <p><strong>Not:</strong> Video içeriğinde tüm adımları detayıyla göreceğiz.</p>
      `,
      duration: 30,
      order: 3
    },
    {
      id: 4,
      courseId: courseId,
      title: "Bilgi Testi",
      description: "Öğrendiklerinizi test edin",
      type: "quiz" as const,
      content: `
        <h3>Öğrendiklerimizi Test Edelim</h3>
        
        <p>Bu bölümde, şimdiye kadar öğrendiğiniz konuları test edeceğiz.</p>
        
        <h4>Quiz Soruları:</h4>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h5>Soru 1:</h5>
          <p>JavaScript'te değişken tanımlamak için hangi anahtar kelimeler kullanılır?</p>
          <ul>
            <li>A) var, let, const</li>
            <li>B) variable, define, set</li>
            <li>C) declare, assign, value</li>
            <li>D) create, make, new</li>
          </ul>
          <p><strong>Doğru Cevap:</strong> A) var, let, const</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h5>Soru 2:</h5>
          <p>Boolean veri tipi hangi değerleri alabilir?</p>
          <ul>
            <li>A) true, false</li>
            <li>B) 0, 1</li>
            <li>C) yes, no</li>
            <li>D) on, off</li>
          </ul>
          <p><strong>Doğru Cevap:</strong> A) true, false</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h5>Soru 3:</h5>
          <p>Aşağıdakilerden hangisi doğru bir fonksiyon tanımlamasıdır?</p>
          <ul>
            <li>A) function myFunction() { }</li>
            <li>B) def myFunction() { }</li>
            <li>C) func myFunction() { }</li>
            <li>D) method myFunction() { }</li>
          </ul>
          <p><strong>Doğru Cevap:</strong> A) function myFunction() { }</p>
        </div>
        
        <h4>Pratik Alıştırma:</h4>
        <p>Aşağıdaki kodu inceleyin ve ne yapacağını tahmin edin:</p>
        <pre><code>
let age = 20;
if (age >= 18) {
    console.log("Reşit");
} else {
    console.log("Reşit değil");
}
        </code></pre>
        <p><strong>Cevap:</strong> Bu kod yaş kontrolü yapar ve 18 yaş ve üstü için "Reşit", altı için "Reşit değil" yazdırır.</p>
      `,
      duration: 10,
      order: 4
    },
    {
      id: 5,
      courseId: courseId,
      title: "İleri Konular",
      description: "Daha derinlemesine konuları keşfedelim",
      type: "text" as const,
      content: `
        <h3>İleri Düzey Konular</h3>
        
        <p>Temel kavramları öğrendiğimize göre, şimdi daha ileri konulara geçebiliriz.</p>
        
        <h4>1. Asenkron Programlama</h4>
        <p>Asenkron programlama, uygulamalarımızın daha verimli çalışmasını sağlar:</p>
        <ul>
          <li><strong>Callbacks:</strong> Geri çağırma fonksiyonları</li>
          <li><strong>Promises:</strong> Söz verme yapısı</li>
          <li><strong>Async/Await:</strong> Modern asenkron programlama</li>
        </ul>
        
        <h4>2. API İletişimi</h4>
        <p>Dış servislerle veri alışverişi:</p>
        <pre><code>
// Fetch API kullanımı
async function getData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Hata:', error);
    }
}
        </code></pre>
        
        <h4>3. Veri Yapıları</h4>
        <p>Karmaşık veri işlemleri için:</p>
        <ul>
          <li><strong>Array Methods:</strong> map, filter, reduce, forEach</li>
          <li><strong>Object Manipulation:</strong> Object.keys, Object.values</li>
          <li><strong>Destructuring:</strong> Yapısal atama</li>
        </ul>
        
        <h4>4. Modern JavaScript (ES6+)</h4>
        <p>Güncel JavaScript özellikleri:</p>
        <ul>
          <li>Arrow Functions</li>
          <li>Template Literals</li>
          <li>Spread Operator</li>
          <li>Classes</li>
          <li>Modules</li>
        </ul>
        
                 <h3>Örnek: Modern JavaScript Kullanımı</h3>
         <pre><code>
 // Arrow function
 const greet = (name) => "Merhaba " + name + "!";
 
 // Destructuring
 const person = { name: 'Ali', age: 25 };
 const { name, age } = person;
 
 // Spread operator
 const numbers = [1, 2, 3];
 const moreNumbers = [...numbers, 4, 5, 6];
 
 // Template literals
 const message = name + " " + age + " yaşında";
 
 // Class tanımlama
 class Person {
     constructor(name, age) {
         this.name = name;
         this.age = age;
     }
     
     introduce() {
         return "Ben " + this.name + ", " + this.age + " yaşındayım";
     }
 }
         </code></pre>
        
        <h4>Sonraki Adımlar</h4>
        <p>Bu konuları öğrendikten sonra şu alanlara odaklanabilirsiniz:</p>
        <ul>
          <li>Framework'ler (React, Vue, Angular)</li>
          <li>Backend geliştirme (Node.js)</li>
          <li>Veritabanı işlemleri</li>
          <li>Test yazma</li>
          <li>Deployment ve DevOps</li>
        </ul>
      `,
      duration: 35,
      order: 5
    }
  ];
  
  return contents;
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);
    const session = await getServerSession(authOptions);
    
    // Kurs bilgilerini getir
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        instructor: true,
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Kurs bulunamadı' },
        { status: 404 }
      );
    }

    // Kullanıcının kursa kayıtlı olup olmadığını kontrol et
    let isEnrolled = false;
    if (session?.user?.id) {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: parseInt(session.user.id),
            courseId: courseId
          }
        }
      });
      isEnrolled = !!enrollment;
    }

    // Kurs içeriklerini getir (örnek içerikler)
    const contents = getCourseContents(courseId);

    return NextResponse.json({
      course,
      contents,
      isEnrolled
    });

  } catch (error) {
    console.error('Course detail error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu' },
      { status: 500 }
    );
  }
} 